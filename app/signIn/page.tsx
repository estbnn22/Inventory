import { SignUp } from "@stackframe/stack";
import Link from "next/link";
export default function SignIn() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5 max-w-md">
        <SignUp />
        <Link href="/" className="btn btn-neutral rounded-lg">
          Back
        </Link>
      </div>
    </div>
  );
}
