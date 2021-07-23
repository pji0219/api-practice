import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
import fetcher from '../fetcher';

function MsgList() {
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // url에 쿼리로 입력하는 id를 받아 오기 위함
  const {
    query: { userId = '' },
  } = useRouter();

  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });

    // 이전 state를 파라미터로 받아서 복사하고 새로운 state도 추가해서 같이 업데이트
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, { text, userId });

    setMsgs((msgs) => {
      // state에서 수정하고자 하는 메세지의 id와 일치하는 항목을 찾음
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

      // 찾고자 하는 index가 -1일 경우는 항목이 없는 경우
      // 그런 경우에는 기존 state 리턴
      if (targetIndex < 0) return msgs;

      // 기존 state를 복사해 새로운 배열을 만듦 (직접적으로 state를 수정하면 안되기 때문)
      const newMsgs = [...msgs];

      // 기존 state를 복사 시킨 새로운 배열의 id가 일치하는 index의 메세지는 잘라내고
      // 기존 state에서 메세지를 복사한 뒤 새로운 텍스트로 수정하고 수정된 메세지를 새로운 배열에 넣고 기존 state에 덮어 씌움
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };

  // 메세지 수정이 완료되면 state를 null로 바꿔줌
  const doneEdit = () => setEditingId(null);

  const onDelete = (id) => {
    setMsgs((msgs) => {
      // state에서 삭제하고자 하는 메세지의 id와 일치하는 항목을 찾음
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

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
    const msgs = await fetcher('get', '/messages');
    setMsgs(msgs);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <>
      <MsgInput mutate={onCreate} />
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
    </>
  );
}

export default MsgList;
