import { FC, useRef, useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./App.scss";

const App: FC = () => {
  let ws: any = useRef(null);

  const [name, setName] = useState("");
  const [hasUser, setHasUser] = useState(false);
  const [content, setContent] = useState("");
  const [chatList, setChatList] = useState<any>([]);

  // 名字改变时
  const handleChangeName = (event: any) => {
    setName(event.target.value);
  };

  // 加入聊天室
  const handleAddChat = () => {
    console.log("name", name);

    if (!name) {
      message.error("输入不可为空");
      return;
    }

    //将加入房间按钮设置不可用（只能加入一次）
    setHasUser(true);
    ws.current = new WebSocket("ws://localhost:4000");
    //在建立连接时会触发
    // ws.current.onopen = function () {
    //   //向服务器发送消息
    //   ws.current.send(
    //     JSON.stringify({
    //       text: name,
    //       type: "setName",
    //     })
    //   );
    // };
    console.log("==", ws.current);

    ws.current.addEventListener("open", () => {
      ws.current.send(
        JSON.stringify({
          text: name,
          type: "setName",
        })
      );
    });

    ws.current.addEventListener("message", (event: any) => {
      console.log("onmessage", event);
      const data: any = JSON.parse(event.data);
      setChatList([...chatList, data]);
    });

    // //自动接收服务器返回的数据
    // ws.current.onmessage = function (event: any) {
    //   console.log("onmessage", event);
    //   const data: any = JSON.parse(event.data);
    //   console.log(data, chatList, name);
    //   // const tmp = chatList.slice(0);
    //   // console.log("tmp", tmp);
    //   // tmp.push(data);
    //   setName("s");
    //   setChatList([...chatList, data]);
    // };
  };

  // 聊天内容改变时
  const handleChangeContent = (event: any) => {
    setContent(event.target.value);
  };

  // 发送聊天内容
  const handleSendContent = () => {
    if (!content) {
      message.warn("输入为空哦");
      return;
    }
    ws.current.addEventListener("open", () => {
      console.log("-");
      ws.current.send(
        JSON.stringify({
          text: content,
          type: "chat",
        })
      );
    });
    ws.current.addEventListener("message", (event: any) => {
      console.log("onmessage", event);
      const data: any = JSON.parse(event.data);
      setChatList([...chatList, data]);
    });
    setContent("");
  };

  return (
    <div className="App">
      <div className="top">
        <Input
          value={name}
          placeholder="输入用户名"
          prefix={<UserOutlined />}
          disabled={hasUser}
          onChange={handleChangeName}
          onPressEnter={handleAddChat}
        />
        <Button type="primary" onClick={handleAddChat} disabled={hasUser}>
          加入聊天
        </Button>
      </div>

      <div className="center">
        {chatList.map((item: any, index: number) => {
          return (
            <div className="chat-container" key={index}>
              <div className="time">{item.name} 2021-20-12 12:00:00</div>
              <div className="content">{item.text}</div>
            </div>
          );
        })}
      </div>

      <div className="footer">
        <Input
          value={content}
          placeholder="输入内容"
          onChange={handleChangeContent}
          onPressEnter={handleSendContent}
          disabled={!hasUser}
        />
        <Button type="primary" onClick={handleSendContent} disabled={!hasUser}>
          发送
        </Button>
      </div>
    </div>
  );
};

export default App;
