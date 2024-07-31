/**
 * Handles multiple promises concurrently for a `mongoose withTransaction`.
 */
export default async function handleMultipleTransactionPromises(promises: Promise<any>[]) {
  const results = await Promise.allSettled(promises),
    errors: string[] = [];

  const fulfilledResults = results.reduce((acc: any[], result, i) => {
    if (result.status === "rejected") {
      // I don't know why I felt the need to format the errors like this, but I did.
      errors.push(
        `{\n  Error${i + 1}: "${(result as PromiseRejectedResult).reason.message}"\n}`
      );
    } else {
      acc.push((result as PromiseFulfilledResult<any>).value);
    }
    
    return acc;
  }, []);

  if (errors.length) throw new Error(`Transaction failed:\n${errors.join(",\n")}`);

  return fulfilledResults;
}
