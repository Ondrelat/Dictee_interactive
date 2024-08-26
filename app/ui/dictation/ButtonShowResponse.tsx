import { useDictationContext } from './dictation';
export default function ShowResponse() {
  const { state, setState, handleNextWord } = useDictationContext();

  const DonnerLaReponse = () => {
    const lastChar = state.currentWordToGuess.toString().slice(-1);
    if ([".", "!", "?", ",", ";", ":"].includes(lastChar)) {
      setState(prevState => ({
        ...prevState,
        audioIndex: state.audioIndex + 1,
      }));
    }
    console.log("state.currentWordToGuess.toString()" + state.currentWordToGuess.toString())
    handleNextWord("incorrect");
  };

  return (
    <button
      className="mt-12 px-6 py-2 text-white font-semibold bg-orange-400 rounded-md hover:bg-blue-600 transition duration-200"
      onClick={DonnerLaReponse}
    >
      <span className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Aide
      </span>
    </button>
  );
}