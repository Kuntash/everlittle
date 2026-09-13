import type { RuntimeEnv } from "./runtime-env";
import { eventStatement } from "./server-analytics";

export function majorAmount(minor: number, currency: string) {
  const digits =
    new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2;
  return minor / 10 ** digits;
}

export async function recordPayment(
  runtime: RuntimeEnv,
  input: {
    paymentId: string;
    archiveId: string;
    ownerId: string;
    amount: number;
    currency: string;
    timestamp: string;
    succeeded: boolean;
  },
) {
  const environment = runtime.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode";
  const properties = {
    payment_id: input.paymentId,
    amount_minor: input.amount,
    amount: majorAmount(input.amount, input.currency),
    currency: input.currency,
    environment,
  };
  const event = await eventStatement(runtime, {
    key: `payment:${environment}:${input.paymentId}:${input.succeeded}`,
    event: input.succeeded ? "payment_succeeded" : "payment_failed",
    userId: input.ownerId,
    archiveId: input.archiveId,
    properties,
    timestamp: input.timestamp,
  });
  const statements = [event];
  if (input.succeeded && input.amount > 0) {
    statements.push(
      runtime.DB.prepare(
        `INSERT OR IGNORE INTO measured_payment(payment_id, environment, archive_id, owner_user_id, amount_minor, currency, paid_at) VALUES(?,?,?,?,?,?,?)`,
      ).bind(
        input.paymentId,
        environment,
        input.archiveId,
        input.ownerId,
        input.amount,
        input.currency,
        input.timestamp,
      ),
    );
    // Exactly one paid-acquisition event per archive/environment, independent of
    // webhook retries or renewal count. Cash receipts remain separate above.
    statements.push(
      await eventStatement(runtime, {
        key: `first-payment:${environment}:${input.archiveId}`,
        event: "first_payment_succeeded",
        userId: input.ownerId,
        archiveId: input.archiveId,
        properties,
        timestamp: input.timestamp,
      }),
    );
  }
  await runtime.DB.batch(statements);
}
