import {
  fetchCustomers,
  fetchCustomersPages,
  fetchTableTypeCustomers,
} from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';
import Pagination from '@/app/ui/invoices/pagination';
import { InvoiceSkeleton, TableRowSkeleton } from '@/app/ui/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchParams } from '../invoices/page';

const Page = async ({ searchParams }: SearchParams) => {
    
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page || 1);
    const customers = await fetchTableTypeCustomers();

    const totalPages = await fetchCustomersPages(query);

  return (
    <>
      <Suspense fallback={<InvoiceSkeleton />}>
        <CustomersTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
};

export default Page;

export const metadata: Metadata = {
  title: 'Customers',
};
