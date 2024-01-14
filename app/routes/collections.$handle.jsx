import {useLoaderData} from '@remix-run/react';
import {json} from '@remix-run/server-runtime';
import {getPaginationVariables} from '@shopify/hydrogen';
import ProductGrid from '~/components/ProductGrid';

const seo = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export const loader = async ({params, context, request}) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {handle} = params;

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      ...paginationVariables,
      handle,
    },
  });

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
  });
};

export const meta = ({data}) => {
  return [
    {title: data?.collection?.title ?? 'Collection'},
    {description: data?.collection?.description ?? ''},
  ];
};

const Collection = () => {
  const {collection} = useLoaderData();

  return (
    <>
      <header className="grid w-full gap-8 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>
        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
      <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
    </>
  );
};

const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) {
    collection(handle: $handle) {
      title
      description
      handle
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export default Collection;
