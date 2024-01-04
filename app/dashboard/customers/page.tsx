import { fetchCustomers } from "@/app/lib/data";
import CustomersTable from "@/app/ui/customers/table";
import { Metadata } from "next";
import { Suspense } from "react";

const Page = async () => {
    const customers = await fetchCustomers();
    console.log(customers);
    
    return (<Suspense>
        <CustomersTable customers={customers}/>
    </Suspense>)
   }


export default Page;

export const metadata: Metadata = {
    title: 'Customers',
  }