import React, { useRef } from 'react';

function MsgInput({ mutate, id = undefined, text = '' }) {
  const textRef = useRef(null);

  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const text = textRef.current.value;
    mutate(text, id);
    textRef.current.value = '';
  };

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        placeholder="내용을 입력 하세요."
        defaultValue={text}
      />
      <button type="submit">완료</button>
    </form>
  );
}

export default MsgInput;
