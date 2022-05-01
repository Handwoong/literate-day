import React, { useState, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  PostingContent,
  PostingArea,
  PostingMessage,
} from "../../styles/PostingStyle";
import "../../styles/markdown.css";

const PostingContents = forwardRef(
  ({ isContentEmpty, setIsContentEmpty }, ref) => {
    const [markdown, setMarkdown] = useState("");
    const handleMarkdown = (e) => {
      e.preventDefault();
      setIsContentEmpty(() => !e.target.value);
      setMarkdown(e.target.value);
      ref.current.style.height = "inherit";
      ref.current.style.height = ref.current.scrollHeight + "px";
    };

    return (
      <>
        <PostingContent>
          <PostingArea
            placeholder="내용을 입력해주세요"
            isContentEmpty={isContentEmpty}
            ref={ref}
            onChange={handleMarkdown}
          ></PostingArea>
          <ReactMarkdown
            children={markdown}
            className={"markdown"}
          ></ReactMarkdown>
        </PostingContent>
        {isContentEmpty && (
          <PostingMessage>내용을 입력해주세요.</PostingMessage>
        )}
      </>
    );
  }
);
export default PostingContents;
