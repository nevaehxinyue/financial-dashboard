import { Metadata } from "next";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import CreateCustomerForm from "@/app/ui/customers/create-form";

const Page = async () => {
    

    return (
        <main>
            <Breadcrumbs breadcrumbs={[
                {label: 'Customers', href: '/dashboard/customers', active: true},
                {
                    label: 'Create Customer',
                    href: `/dashboard/customers/create`,
                    active: true,
                }
               
            ]} />
            <CreateCustomerForm />

        </main>
    )
}



export default Page

export const metadata: Metadata = {
    title: 'Create Customer',
  }