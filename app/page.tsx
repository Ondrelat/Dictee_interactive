import { redirect } from 'next/navigation'
import Head from 'next/head';
export default async function Home() {

  return (
    <>
    <Head>
      <link rel="canonical" href="https://example.com/dictee" />
    </Head>
    {redirect('/dictee')}
  </>
  );
}
