import { apiFetch } from "@/lib/api-client";

export function subscribeToPush(subscription: PushSubscriptionJSON) {
  return apiFetch<void>("/users/me/push-subscription", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
}

export function unsubscribeFromPush(endpoint: string) {
  return apiFetch<void>("/users/me/push-subscription", {
    method: "DELETE",
    body: JSON.stringify({ endpoint }),
  });
}
