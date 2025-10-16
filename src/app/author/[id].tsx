import { PortableText } from "@portabletext/react-native";
import { AuthorImage } from "@src/components/AuthorImage";
import { HeaderButton } from "@src/components/HeaderButton/HeaderButton";
import { ThemedText, ThemedView, useThemeColor } from "@src/components/Themed";
import { blogService } from "@src/services/blog-service";
import imageService from "@src/services/image-service";
import { theme } from "@src/theme";
import { useQuery } from "@tanstack/react-query";
import { osName } from "expo-device";
import {
  Stack,
  useIsPreview,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

export default function AuthorScreen() {
  const isPreview = useIsPreview();
  const params = useLocalSearchParams();
  const router = useRouter();

  const borderColor = useThemeColor(theme.color.border);
  const backgroundColorSecondary = useThemeColor(
    theme.color.backgroundSecondary
  );

  const { data: author } = useQuery({
    queryKey: ["author", params.id],
    queryFn: () => blogService.getAuthor(params.id as string),
  });

  return (
    <>
      {!isPreview && (
        <Stack.Screen
          options={{
            title: "",
            headerLeft: () =>
              Platform.select({
                ios: (
                  <HeaderButton
                    buttonProps={{ onPress: router.back }}
                    style={{ padding: osName === "iPadOS" ? 40 : 0 }}
                  />
                ),
                default: undefined,
              }),
          }}
        />
      )}

      <ThemedView
        style={styles.container}
        color={{
          light: theme.color.background.light,
          dark: isPreview
            ? backgroundColorSecondary
            : theme.color.background.dark,
        }}
      >
        {author ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={[
              styles.contentContainer,
              isPreview && styles.previewContent,
            ]}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centered}>
              <AuthorImage
                style={styles.speakerImage}
                profilePicture={imageService.urlFor(
                  author.image?.asset?.url as string
                )}
                size={isPreview ? "medium" : "large"}
              />
              <ThemedText
                fontSize={isPreview ? theme.fontSize16 : theme.fontSize18}
                fontWeight="medium"
                numberOfLines={isPreview ? 2 : undefined}
                style={styles.authorName}
              >
                {author.name}
              </ThemedText>
              {!isPreview && (
                <View
                  style={[styles.separator, { borderBottomColor: borderColor }]}
                />
              )}
            </View>
            {author.bio && !isPreview ? (
              <PortableText
                value={author.bio}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <ThemedText
                        fontSize={theme.fontSize14}
                        fontWeight="medium"
                        style={{
                          marginBottom: theme.space16,
                          lineHeight: theme.fontSize14 * 1.6,
                        }}
                      >
                        {children}
                      </ThemedText>
                    ),
                    h1: ({ children }) => (
                      <ThemedText
                        fontSize={theme.fontSize24}
                        fontWeight="bold"
                        style={{ marginBottom: theme.space16 }}
                      >
                        {children}
                      </ThemedText>
                    ),
                    h2: ({ children }) => (
                      <ThemedText
                        fontSize={theme.fontSize20}
                        fontWeight="bold"
                        style={{ marginBottom: theme.space12 }}
                      >
                        {children}
                      </ThemedText>
                    ),
                    blockquote: ({ children }) => (
                      <View
                        style={{
                          borderLeftWidth: 4,
                          borderLeftColor: borderColor,
                          paddingLeft: theme.space16,
                          marginVertical: theme.space16,
                        }}
                      >
                        <ThemedText
                          fontSize={theme.fontSize14}
                          fontWeight="light"
                          style={{ fontStyle: "italic" }}
                          color={theme.color.textSecondary}
                        >
                          {children}
                        </ThemedText>
                      </View>
                    ),
                  },
                  marks: {
                    strong: ({ children }) => (
                      <ThemedText fontWeight="bold">{children}</ThemedText>
                    ),
                    em: ({ children }) => (
                      <ThemedText style={{ fontStyle: "italic" }}>
                        {children}
                      </ThemedText>
                    ),
                    link: ({ value, children }) => (
                      <ThemedText
                        style={{ textDecorationLine: "underline" }}
                        color={{
                          light: theme.color.reactBlue.light,
                          dark: theme.color.reactBlue.dark,
                        }}
                      >
                        {children}
                      </ThemedText>
                    ),
                  },
                  list: {
                    bullet: ({ children }) => (
                      <View style={{ marginBottom: theme.space16 }}>
                        {children}
                      </View>
                    ),
                    number: ({ children }) => (
                      <View style={{ marginBottom: theme.space16 }}>
                        {children}
                      </View>
                    ),
                  },
                  listItem: {
                    bullet: ({ children }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: theme.space8,
                        }}
                      >
                        <ThemedText style={{ marginRight: theme.space8 }}>
                          •
                        </ThemedText>
                        <ThemedText
                          fontSize={theme.fontSize14}
                          fontWeight="medium"
                          style={{
                            flex: 1,
                            lineHeight: theme.fontSize14 * 1.6,
                          }}
                        >
                          {children}
                        </ThemedText>
                      </View>
                    ),
                    number: ({ children, index }) => (
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: theme.space8,
                        }}
                      >
                        <ThemedText style={{ marginRight: theme.space8 }}>
                          {index + 1}.
                        </ThemedText>
                        <ThemedText
                          fontSize={theme.fontSize14}
                          fontWeight="medium"
                          style={{
                            flex: 1,
                            lineHeight: theme.fontSize14 * 1.6,
                          }}
                        >
                          {children}
                        </ThemedText>
                      </View>
                    ),
                  },
                }}
              />
            ) : null}
            {author.bio && isPreview ? (
              <ThemedText
                fontSize={theme.fontSize12}
                fontWeight="light"
                numberOfLines={2}
                style={styles.previewBio}
                color={theme.color.textSecondary}
              >
                <PortableText value={author.bio} />
              </ThemedText>
            ) : null}
          </ScrollView>
        ) : (
          <View>
            <ThemedText>Author not found</ThemedText>
          </View>
        )}
      </ThemedView>
    </>
  );
}
const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    borderBottomLeftRadius: theme.borderRadius20,
    borderBottomRightRadius: theme.borderRadius20,
    padding: theme.space16,
    paddingTop: theme.space24,
  },
  previewContent: {
    paddingHorizontal: theme.space16,
    paddingVertical: theme.space24,
    width: "90%",
    alignSelf: "center",
  },
  authorName: {
    textAlign: "center",
  },
  previewBio: {
    textAlign: "center",
  },
  icon: {
    height: theme.fontSize20,
    width: theme.fontSize20,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.space24,
    width: "100%",
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.space24,
  },
  speakerImage: {
    marginBottom: theme.space24,
  },
  tagLine: {
    textAlign: "center",
  },
});
