import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
import fetcher from '../fetcher';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

function MsgList({ smsgs, users }) {
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);

  // url에 쿼리로 입력하는 id를 받아 오기 위함
  const { query } = useRouter();
  const userId = query.userId || query.userid || '';

  const fetchMoreEl = useRef(null);

  // 무한 스크롤을 하기 위한 커스텀 훅
  const intersecting = useInfiniteScroll(fetchMoreEl);

  // 스크롤될 다음 메세지가 있는지 여부
  const [hasNext, setHasNext] = useState(true);

  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    if (!newMsg) throw Error('somthing wrong');

    // 이전 state를 파라미터로 받아서 복사하고 새로운 state도 추가해서 같이 업데이트
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMsg) throw Error('somthing wrong');

    setMsgs((msgs) => {
      // state에서 수정하고자 하는 메세지의 id와 일치하는 항목을 찾음
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

      // 찾고자 하는 index가 -1일 경우는 항목이 없는 경우
      // 그런 경우에는 기존 state 리턴
      if (targetIndex < 0) return msgs;

      // 기존 state를 복사해 새로운 배열을 만듦 (직접적으로 state를 수정하면 안되기 때문)
      const newMsgs = [...msgs];

      // 기존 state를 복사 시킨 새로운 배열의 id가 일치하는 index의 메세지는 잘라내고
      // 서버에서 응답온 수정된 메세지를 새로운 배열에 넣고 state 업데이트
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    doneEdit();
  };

  // 메세지 수정이 완료되면 state를 null로 바꿔줌
  const doneEdit = () => setEditingId(null);

  const onDelete = async (id) => {
    const receviedId = await fetcher('delete', `/messages/${id}`, { params: { userId } });

    setMsgs((msgs) => {
      // state에서 삭제하고자 하는 메세지의 id와 일치하는 항목을 찾음
      const targetIndex = msgs.findIndex((msg) => msg.id === receviedId + '');

      // 찾고자 하는 index가 -1일 경우는 항목이 없는 경우
      // 그런 경우에는 기존 state 리턴
      if (targetIndex < 0) return msgs;

      // 기존 state를 복사해 새로운 배열을 만듦
      const newMsgs = [...msgs];

      // 기존 state를 복사 시킨 새로운 배열의 id가 일치하는 index의 메세지는 잘라냄
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const getMessages = async () => {
    const newMsgs = await fetcher('get', '/messages', { params: { cursor: msgs[msgs.length - 1]?.id || '' } });
    
    // 응답 받아온 메세지가 없으면 아무것도 안하고 리턴
    if (newMsgs.length === 0) {
      setHasNext(false)
      return
    }

    setMsgs(msgs => [...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((item) => (
          <MsgItem
            key={item.id}
            userId={item.userId}
            timestamp={item.timestamp}
            text={item.text}
            id={item.id}
            onUpdate={onUpdate}
            onDelete={() => onDelete(item.id)}
            startEdit={() => setEditingId(item.id)}
            isEditing={editingId === item.id}
            myId={userId}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
}

export default MsgList;
