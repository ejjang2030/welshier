import React, {useState, useRef, useEffect} from "react";

interface HashtagEditorProps {
  value: string;
  onChange: (value: string, hashtags: string[]) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

const HashtagEditor: React.FC<HashtagEditorProps> = ({
  value,
  onChange,
  placeholder = "",
  style,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 체크

  // 해시태그를 추출하는 함수
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_가-힣ㄱ-ㅎㅏ-ㅣ]+/g; // 해시태그 정규식: 한글 자음, 모음 포함
    const hashtags = text.match(hashtagRegex);
    return hashtags ? hashtags : [];
  };

  // 해시태그를 포함한 텍스트에 스타일을 적용
  const applyHashtagStyle = (text: string): string => {
    return text.replace(/(#[a-zA-Z0-9_가-힣ㄱ-ㅎㅏ-ㅣ]+)/g, match => {
      return `<span style="color:blue;">${match}</span>`;
    });
  };

  // 현재 커서 위치를 가져오는 함수
  const getCaretPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current as Node);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  // 커서 위치를 설정하는 함수
  const setCaretPosition = (position: number) => {
    const selection = window.getSelection();
    if (selection) {
      const editor = editorRef.current;
      let node = editor?.firstChild;
      let chars = position;
      let range = document.createRange();

      if (node) {
        while (node && chars > 0) {
          if (node.nodeType === 3) {
            // 텍스트 노드
            if (node.textContent!.length >= chars) {
              range.setStart(node, chars);
              range.setEnd(node, chars);
              break;
            } else {
              chars -= node.textContent!.length;
            }
          }
          node = node.nextSibling;
        }

        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleInput = () => {
    if (isComposing) return;

    const editor = editorRef.current;
    if (editor) {
      const caretPosition = getCaretPosition(); // 커서 위치 저장

      const text = editor.innerText || ""; // 입력된 텍스트
      const hashtags = extractHashtags(text); // 해시태그 추출
      onChange(text, hashtags); // 텍스트와 해시태그 배열을 부모에 전달

      // 해시태그 스타일 적용
      editor.innerHTML = applyHashtagStyle(text);

      setCaretPosition(caretPosition); // 커서 위치 복원
    }
  };

  // 한글 입력 조합 시작
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // 한글 입력 조합 완료
  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleInput();
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerText !== value) {
      const caretPosition = getCaretPosition(); // 커서 위치 저장
      editor.innerHTML = applyHashtagStyle(value);
      setCaretPosition(caretPosition); // 커서 위치 복원
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      contentEditable={true}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      style={{
        width: "100%",
        height: "100px",
        border: "1px solid lightgray",
        padding: "8px",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
        color: value === "" ? "gray" : "black",
        ...style,
      }}>
      {value === "" ? <span style={{opacity: 0.5}}>{placeholder}</span> : null}
    </div>
  );
};

export default HashtagEditor;
