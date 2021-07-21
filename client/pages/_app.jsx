import './index.scss';

// next.js를 서버 사이드 렌더링하게 해주는 컴포넌트
const App = ({ Component, pageProps }) => <Component {...pageProps} />;

App.getInitialProps = async ({ context, Component }) => {
  const pageProps = await Component.getInitialProps?.(context);
  return { pageProps };
};

export default App;
