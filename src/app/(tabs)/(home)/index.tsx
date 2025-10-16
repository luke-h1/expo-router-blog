import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { queryClient } from "@src/app/_layout";
import { PostCard } from "@src/components/PostCard";
import { useThemeColor } from "@src/components/Themed";
import { blogService, PostWithAuthor } from "@src/services/blog-service";
import { theme } from "@src/theme";
import { useQuery } from "@tanstack/react-query";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useCallback, useRef, useState } from "react";
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
  useAnimatedStyle,
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
  const isLiquidGlass = isLiquidGlassAvailable();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const animatedTranslateY = useSharedValue(0);
  const isScrolledDown = useSharedValue(false);

  const stickyHeaderStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "ios") {
      return {};
    }

    return {
      transform: [{ translateY: animatedTranslateY.value }],
      backgroundColor: isLiquidGlass ? "transparent" : backgroundColor,
    };
  });

  const renderItem: ListRenderItem<PostWithAuthor> = useCallback(({ item }) => {
    return <PostCard post={item} key={item._id} />;
  }, []);

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

  return (
    <>
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
