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
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send(msgs);
    }
  },

  { // CREATE MESSAGES
    method: 'post',
    route: '/messages',
    handler: ({ body }, res) => {
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

      res.send(newMsg);
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

        const newMsg = { ...msgs[targetIndex], text: body.text }

      } catch (err) {

      }
    }
  },

  { // DELETE MESSAGES
    method: 'delete',
    route: '/messages/:id',
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send();
    }
  }
]

export default messagesRoute;