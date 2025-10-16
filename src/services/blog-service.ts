import { Author, Post } from "@src/types/sanity.types";
import { client } from "./sanity-client";

// Custom type for Post with dereferenced author
export type PostWithAuthor = Omit<Post, "author"> & {
  author: Author & {
    image?: {
      asset?: {
        url?: string;
      };
    } & Omit<NonNullable<Author["image"]>, "asset">;
  };
};

export const blogService = {
  getAllAuthors: async () => {
    const authors = await client.fetch<PostWithAuthor["author"][]>(`
      *[ _type == "author"] {
        ...,
        image{
          asset->{
            url
          }
        }
      }
      |order(name asc)
    `);
    return authors;
  },
  getAuthor: async (id: string) => {
    const author = await client.fetch<PostWithAuthor["author"]>(
      `
    *[ _type == "author" && _id == $id][0] {
        ...,
              image{
              asset->{
                url
              }
            
        }
      }
    `,
      { id }
    );
    return author;
  },
  getAllPosts: async () => {
    const posts = await client.fetch<PostWithAuthor[]>(`
        *[ _type == "post"] {
          ...,
          author->{
            ...,
            image{
              asset->{
                url
              }
            }
          }
        }
        |order(publishedAt desc)
    `);

    return posts;
  },

  getPostBySlug: async (slug: string) => {
    const post = await client.fetch<PostWithAuthor>(
      `
        *[ _type == "post" && slug.current == $slug][0] {
          ...,
          author->{
            ...,
            image{
              asset->{
                url
              }
            }
          }
        }`,
      { slug }
    );

    return post;
  },

  getPostById: async (id: string) => {
    const post = await client.fetch<PostWithAuthor>(
      `
        *[ _type == "post" && _id == $id][0] {
          ...,
          author->{
            ...,
            image{
              asset->{
                url
              }
            }
          },
          mainImage{
            asset->{
              url
            }
          }
        }`,
      { id }
    );

    return post;
  },
} as const;
