import { createRoot } from "react-dom/client";
import englishTranslations from "./i18n/en-US.json";
import spanishTranslations from "./i18n/es-MX.json";

const AddTodoTitleEnglish = () => {
  // INTENTIONAL - UNCOMMENT to show how 2 eslint loader instances can display their corresponding errors
  // param = "some other value";
  return <h1>{englishTranslations["todos.addTodo"]}</h1>;
};

const AddTodoTitleSpanish = () => {
  // INTENTIONAL - UNCOMMENT to show how 2 eslint loader instances can display their corresponding errors
  //param = 'some other value';
  return <h1>{spanishTranslations["todos.addTodo"]}</h1>;
};

const App = () => {
  return (
    <div>
      <AddTodoTitleEnglish />
      <AddTodoTitleSpanish />
    </div>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
