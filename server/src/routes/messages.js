import { readDB, writeDB } from '../dbController.js';
import { v4 } from 'uuid';

// messages DB 읽기
const getMsgs = () => readDB('messages');

// messages DB 쓰기
const setMsgs = data => writeDB('messages', data);

const messagesRoute = [
  { // GET MESSAGES
    method: 'get',
    route: '/messages',
    handler: ({ query: { cursor = '' } }, res) => {
      const msgs = getMsgs();
      const fromIndex = msgs.findIndex(msg => msg.id === cursor) + 1

      res.send(msgs.slice(fromIndex, fromIndex + 15));
    }
  },

  { // GET MESSAGE
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, res) => {
      try {
        const msgs = getMsgs();
        const msg = msgs.find(m => m.id === id);
        if (!msg) throw Error('not found');
        res.send(msg);

      } catch (err) {
        res.status(404).send({ error: err });
      }
    }
  },

  { // CREATE MESSAGES
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
      try {
        if (!body.userId) throw Error('no user id');
        const msgs = getMsgs();

        // 새로운 메세지
        const newMsg = {
          id: v4(),
          text: body.text,
          userId: body.userId,
          timestamp: Date.now()
        }

        // 새로운 메세지 배열에 추가
        msgs.unshift(newMsg);

        // DB에 추가
        setMsgs(msgs);

        // 새로운 메세지 응답
        res.send(newMsg);

      } catch (err) {
        res.status(500).send({ error: err });
      }
    }
  },

  { // UPDATE MESSAGES
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      try {
        const msgs = getMsgs();

        // DB에서 수정하려는 메세지 id와 같은 메세지를 찾음
        const targetIndex = msgs.findIndex(msg => msg.id === id);

        if (targetIndex < 0) throw '메세지가 없습니다.';
        if (msgs[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        // 수정된 메세지
        const newMsg = { ...msgs[targetIndex], text: body.text }

        // 기존 메세지를 수정된 메세지로 교체
        msgs.splice(targetIndex, 1, newMsg)

        // DB에 저장
        setMsgs(msgs);

        // 수정된 메세지 응답
        res.send(newMsg);

      } catch (err) {
        res.status(500).send({ error: err });
      }
    }
  },

  { // DELETE MESSAGES
    method: 'delete',
    route: '/messages/:id',
    handler: ({ params: { id }, query: { userId } }, res) => {
      try {
        const msgs = getMsgs();

        // DB에서 삭제하려는 메세지 id와 같은 메세지를 찾음
        const targetIndex = msgs.findIndex(msg => msg.id === id);

        if (targetIndex < 0) throw '메세지가 없습니다.';
        if (msgs[targetIndex].userId !== userId) throw '사용자가 다릅니다.'

        // 선택한 메세지를 삭제
        msgs.splice(targetIndex, 1)

        // DB에 저장
        setMsgs(msgs);

        // 수정된 메세지 응답
        res.send(id);

      } catch (err) {
        res.status(500).send({ error: err });
      }
    }
  }
]

export default messagesRoute;