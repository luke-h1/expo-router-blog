import { AuthorImage } from "@src/components/AuthorImage";
import { ThemedText, useThemeColor } from "@src/components/Themed";
import { blogService, PostWithAuthor } from "@src/services/blog-service";
import { theme } from "@src/theme";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import Head from "expo-router/head";
import { useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthorScreen() {
  const { data, isPending, error, refetch, isRefetching } = useQuery({
    queryKey: ["authors"],
    queryFn: () => blogService.getAllAuthors(),
  });

  const backgroundColor = useThemeColor(theme.color.background);
  const borderColor = useThemeColor(theme.color.border);
  const insets = useSafeAreaInsets();

  const renderItem: ListRenderItem<PostWithAuthor["author"]> = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          style={[styles.authorCard, { borderBottomColor: borderColor }]}
          onPress={() => {
            router.push(`/author/${item._id}`);
          }}
        >
          <AuthorImage
            profilePicture={item.image?.asset?.url as string}
            size="medium"
            authorName={item.name}
          />
          <View style={styles.authorInfo}>
            <ThemedText fontSize={theme.fontSize16} fontWeight="semiBold">
              {item.name}
            </ThemedText>
            {item.bio &&
            item.bio.length > 0 &&
            item.bio[0]?.children?.[0]?.text ? (
              <ThemedText
                fontSize={theme.fontSize14}
                color={theme.color.textSecondary}
                numberOfLines={2}
              >
                {item.bio[0].children[0].text}
              </ThemedText>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [borderColor]
  );

  if (isPending) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ThemedText>Loading authors...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <ThemedText color={theme.color.border}>
          Error loading authors: {error.message}
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <Head>
        <title>Authors | Expo Router Blog</title>
        <meta
          name="description"
          content="Browse all authors and contributors on Expo Router Blog. Discover their profiles, bios, and published articles."
        />
      </Head>
      <FlatList
        data={data}
        style={{ backgroundColor }}
        contentContainerStyle={{
          paddingBottom: Platform.select({
            android: 100 + insets.bottom,
            default: 0,
          }),
        }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText color={theme.color.textSecondary}>
              No authors found
            </ThemedText>
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authorCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.space16,
    paddingHorizontal: theme.space12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  authorInfo: {
    flex: 1,
    gap: theme.space4,
  },
  emptyContainer: {
    padding: theme.space24,
    alignItems: "center",
  },
});
