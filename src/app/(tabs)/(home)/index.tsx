import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { queryClient } from "@src/app/_layout";
import { PostCard } from "@src/components/PostCard";
import { ThemedText, ThemedView, useThemeColor } from "@src/components/Themed";
import { usePreloadImages } from "@src/hooks/usePreloadImages";
import { blogService, PostWithAuthor } from "@src/services/blog-service";
import imageService from "@src/services/image-service";
import { theme } from "@src/theme";
import { useQuery } from "@tanstack/react-query";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import Head from "expo-router/head";
import { useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
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
  const backgroundColor = useThemeColor(theme.color.background);
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

  if (isPending) {
    return (
      <>
        <Head>
          <title>Expo Router Blog - Latest Posts</title>
          <meta
            name="description"
            content="Discover the latest articles and posts on Expo Router Blog."
          />
        </Head>
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
          <ThemedText style={{ marginTop: 16 }}>Loading posts...</ThemedText>
        </ThemedView>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Expo Router Blog - Latest Posts</title>
          <meta
            name="description"
            content="Discover the latest articles and posts on Expo Router Blog."
          />
        </Head>
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <ThemedText
            color={theme.color.textSecondary}
            style={{ textAlign: "center" }}
          >
            Error loading posts: {error.message}
          </ThemedText>
          <ThemedText
            color={theme.color.reactBlue}
            style={{ marginTop: 16 }}
            onPress={() => refetch()}
          >
            Tap to retry
          </ThemedText>
        </ThemedView>
      </>
    );
  }

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
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
        style={{ backgroundColor }}
        contentContainerStyle={{
          paddingTop: Platform.select({
            android: insets.top,
            default: 0,
          }),
          paddingBottom: Platform.select({
            android: 100 + insets.bottom,
            default: 0,
          }),
        }}
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled
        onScroll={scrollHandler}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemedView style={{ padding: 24, alignItems: "center" }}>
            <ThemedText color={theme.color.textSecondary}>
              No posts found
            </ThemedText>
          </ThemedView>
        }
      />
    </>
  );
}
