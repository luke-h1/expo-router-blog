import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { queryClient } from "@src/app/_layout";
import { PostCard } from "@src/components/PostCard";
import { usePreloadImages } from "@src/hooks/usePreloadImages";
import { blogService, PostWithAuthor } from "@src/services/blog-service";
import imageService from "@src/services/image-service";
import { theme } from "@src/theme";
import { useQuery } from "@tanstack/react-query";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import Head from "expo-router/head";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<PostWithAuthor>
);

const HEADER_SCROLL_OFFSET = isLiquidGlassAvailable() ? 110 : 90;

export default function HomeScreen() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => blogService.getAllPosts(),
  });

  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef as any);
  const backgroundColor = theme.color.background.dark;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const animatedTranslateY = useSharedValue(0);
  const isScrolledDown = useSharedValue(false);

  const renderItem: ListRenderItem<PostWithAuthor> = useCallback(
    ({ item, index }) => {
      const priority = index < 2 ? "high" : "normal";
      return <PostCard post={item} key={item._id} priority={priority} />;
    },
    []
  );

  useFocusEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    animatedTranslateY.value = interpolate(
      event.contentOffset.y,
      [-HEADER_SCROLL_OFFSET, 0],
      [0, HEADER_SCROLL_OFFSET],
      Extrapolation.CLAMP
    );

    isScrolledDown.value = event.contentOffset.y > 10;
  });

  const criticalImages = useMemo(() => {
    if (!data || Platform.OS !== "web") return [];
    return data
      .slice(0, 2)
      .map((post) => {
        return imageService.urlFor(post.author?.image?.asset?.url as string, {
          width: 84,
          height: 84,
        });
      })
      .filter(Boolean);
  }, [data]);

  usePreloadImages(criticalImages);

  return (
    <>
      <Head>
        <title>Expo Router Blog - Latest Posts</title>
        <meta
          name="description"
          content="Discover the latest articles and posts on Expo Router Blog. Stay updated with modern React Native development and best practices."
        />
      </Head>
      <AnimatedFlatList
        ref={scrollRef}
        data={data}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
        }
        style={{ backgroundColor }}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            android: 100 + insets.bottom,
            default: 0,
          }),
        }}
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled
        onScroll={scrollHandler}
        stickyHeaderIndices={[0]}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </>
  );
}
