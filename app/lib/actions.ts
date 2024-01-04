'use server';
// 'zod' is a TypeScript-first validation library for handling data type validation
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

//Valudate formData before saving it to database
const FormSchema = z.object({
  id: z.string(),
  //Set up friendly error messages to users
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  // To coerce from a string to a number while also validating its types
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch(error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default: 
                    return 'Something went wrong.'
            }
        }
        throw error;
    }
}

export async function createInvoice(prevState: State, formData: FormData) {
  // const rawFormData = Object.fromEntries(formData.entries())
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  //It's usually good practice to store monetary values in database to
  //eliminate JavaScript floating-point errors and ensure greater accuracy.
  const amountInCents = amount * 100;
  //.toISOString(): This method converts the Date object to a string using the ISO 8601 format.
  //The resulting string has the format YYYY-MM-DDTHH:mm:ss.sssZ.
  //.split('T')[0]: This method splits the ISO string into an array using 'T' as the delimiter,
  //separating the date and the time parts. The split method returns an array,
  //and [0] accesses the first element of that array, which is the date part of the ISO string (YYYY-MM-DD).
  const date = new Date().toISOString().split('T')[0];
  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date} )
    `;
  } catch (error) {
    return {
      message: 'Database error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields: Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}, date = ${date}
        WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  // throw new Error ('Failed to Delete Invoice');

  try {
    await sql`
        DELETE FROM invoices WHERE id = ${id}
    `;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return {
      message: 'Database error: Failed to Delete Invoice.',
    };
  }
}
