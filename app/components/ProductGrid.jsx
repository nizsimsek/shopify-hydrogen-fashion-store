import {Pagination} from '@shopify/hydrogen';
import ProductCard from './ProductCard';

const ProductGrid = ({collection, url}) => {
  return (
    <section className="w-full gap-4 md:gap-8 grid">
      <Pagination connection={collection.products}>
        {({nodes, NextLink, PreviousLink, isLoading}) => (
          <>
            <div className="flex items-center justify-center mt-6">
              <PreviousLink className="inline-block rounded font-medium text-center py-3 px-6 border w-full cursor-pointer">
                {isLoading ? 'Loading...' : 'Load Previous Products'}
              </PreviousLink>
            </div>
            <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {nodes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex items-center justify-center mt-6">
              <NextLink className="inline-block rounded font-medium text-center py-3 px-6 border w-full cursor-pointer">
                {isLoading ? 'Loading...' : 'Load More Products'}
              </NextLink>
            </div>
          </>
        )}
      </Pagination>
    </section>
  );
};

export default ProductGrid;
