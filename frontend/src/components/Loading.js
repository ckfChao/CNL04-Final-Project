import Spinner from "react-spinkit";

function Loading() {
   return (
      <div className="flex justify-center items-center">
         <Spinner className="mt-10" name="circle" style={{ width: 100, height: 100 }} />
      </div>
   );
}

export default Loading;