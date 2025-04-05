'use client';
import { Button, Callout, TextField } from '@radix-ui/themes'
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Spinner from '@/app/components/Spinner';

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false
});


interface IssueForm {
    title: string;
    description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const {register, control, handleSubmit} = useForm<IssueForm>();
  const [error , setError] = useState('');
  const [isSubmitting, setSubmitting ] = useState(false);

  return (
    <div className='max-w-xl'>
    {error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
        </Callout.Root>}
    <form className='space-y-3'
     onSubmit={handleSubmit(async (data) => {
        try{
            setSubmitting(true);
            await axios.post('/api/issues', data);
            router.push('/issues');
        } catch (error) {
            setSubmitting(false);
            setError('An unexpected error occured.');
        }

     })}>
    <TextField.Root placeholder="Title…" {...register('title')}></TextField.Root>
    <Controller
        name="description"
        control={control}
        render={({field}) => <SimpleMDE placeholder='Description' {...field} />} 
    />
    <Button disabled={isSubmitting}>
        Submit new issue {isSubmitting && <Spinner/>}
    </Button>

    </form>
    </div>
  )
}

export default NewIssuePage