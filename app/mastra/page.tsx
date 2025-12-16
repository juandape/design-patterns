import { ChatBot } from '@/src/mastra/ChatBot/ChatBot';

export default function MastraPage() {
  return (
    <div className='p-5 mt-5 w-1/2 bg-white text-black mx-auto'>
      <h1>Mastra Assistant</h1>
      <ChatBot />
    </div>
  );
}
