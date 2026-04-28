import type { NextFunction, Request, Response } from "express";

/**
 * Registered last. Call `next(err)` from async handlers to reach this.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[API]", err);
  const message =
    err instanceof Error ? err.message : "Something went wrong";
  const status =
    err && typeof err === "object" && "status" in err && typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;
  if (!res.headersSent) {
    res.status(status).json({ message });
  }
}
