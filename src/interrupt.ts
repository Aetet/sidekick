import { effect as T } from "@matechs/effect";
import { array } from "fp-ts/lib/Array";

export async function interrupt() {
  let counter = 0;

  const program = T.asyncTotal(x => {
    const timer = setTimeout(() => {
      x(undefined);
    }, 3000);
    return cb => {
      counter++;
      clearTimeout(timer);
      cb();
    };
  });

  const a = [program, program];
  const par = array.sequence(T.parEffect)(a);

  const fiber = await T.runToPromise(T.fork(par));

  await T.runToPromise(fiber.interrupt);

  console.log("counter:", counter);
}
