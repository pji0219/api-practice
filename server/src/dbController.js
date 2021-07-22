import fs from 'fs';
// 파일 경로를 수정하기 위해 가져옴
import { resolve } from 'path';

// 현재의 경로가 베이스패스로 잡힘(루트)
const basePath = resolve();

const filenames = {
  messages: resolve(basePath, 'src/db/messages.json'),
  users: resolve(basePath, 'src/db/users.json')
}

// 파일을 읽음
export const readDB = target => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'));
  } catch (err) {
    console.error(err);
  }
}

// 파일을 씀

export const writeDB = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}