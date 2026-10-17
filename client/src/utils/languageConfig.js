// Mirrors server/src/utils/languageConfig.js so the editor, language selector,
// and execution requests all agree on supported languages in one place.
export const LANGUAGES = {
  javascript: {
    label: 'JavaScript',
    monacoId: 'javascript',
    defaultCode: 'console.log("Hello from CodeSync!");\n',
  },
  python: {
    label: 'Python',
    monacoId: 'python',
    defaultCode: 'print("Hello from CodeSync!")\n',
  },
  cpp: {
    label: 'C++',
    monacoId: 'cpp',
    defaultCode:
      '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from CodeSync!" << endl;\n    return 0;\n}\n',
  },
  java: {
    label: 'Java',
    monacoId: 'java',
    defaultCode:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from CodeSync!");\n    }\n}\n',
  },
};

export const LANGUAGE_LIST = Object.entries(LANGUAGES).map(([id, cfg]) => ({ id, ...cfg }));
