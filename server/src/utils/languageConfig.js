/**
 * Centralized language configuration.
 * Add a new language in ONE place and it becomes available everywhere:
 * Monaco editor (frontend), Judge0 execution, and Piston execution.
 */

const LANGUAGES = {
  javascript: {
    label: 'JavaScript',
    monacoId: 'javascript',
    judge0Id: 63, // Node.js (12.14.0)
    pistonLanguage: 'javascript',
    pistonVersion: '18.15.0',
    fileName: 'main.js',
    defaultCode: `console.log("Hello from CodeSync!");\n`,
  },
  python: {
    label: 'Python',
    monacoId: 'python',
    judge0Id: 71, // Python (3.8.1)
    pistonLanguage: 'python',
    pistonVersion: '3.10.0',
    fileName: 'main.py',
    defaultCode: `print("Hello from CodeSync!")\n`,
  },
  cpp: {
    label: 'C++',
    monacoId: 'cpp',
    judge0Id: 54, // C++ (GCC 9.2.0)
    pistonLanguage: 'cpp',
    pistonVersion: '10.2.0',
    fileName: 'main.cpp',
    defaultCode: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from CodeSync!" << endl;\n    return 0;\n}\n`,
  },
  java: {
    label: 'Java',
    monacoId: 'java',
    judge0Id: 62, // Java (OpenJDK 13.0.1)
    pistonLanguage: 'java',
    pistonVersion: '15.0.2',
    fileName: 'Main.java',
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from CodeSync!");\n    }\n}\n`,
  },
};

const isSupportedLanguage = (lang) => Object.prototype.hasOwnProperty.call(LANGUAGES, lang);

const getLanguageConfig = (lang) => LANGUAGES[lang];

module.exports = { LANGUAGES, isSupportedLanguage, getLanguageConfig };
