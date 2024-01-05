import { fetchCustomers } from "@/app/lib/data"
import CreateCustomerForm from "@/app/ui/customers/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { Metadata } from "next";

const Page = async () => {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Invoices', href: '/dashboard/invoices', active: true},
                {
                    label: 'Create Invoice',
                    href: `/dashboard/invoices/create`,
                    active: true,
                }
               
            ]} />
            <CreateCustomerForm />

        </main>
    )
}



export default Page

export const metadata: Metadata = {
    title: 'Create Invoice',
  }