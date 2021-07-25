import React from 'react';
import MsgList from '../components/MsgList';
import fetcher from '../fetcher';

function Home({ smsgs, users }) {
  return (
    <>
      <h1>SIMPLE SNS</h1>
      <MsgList smsgs={smsgs} users={users} />
    </>
  );
}

export const getServerSideProps = async () => {
  const smsgs = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');

  return {
    props: { smsgs, users }
  }
}

export default Home;
