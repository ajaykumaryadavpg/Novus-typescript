## Say you want to perform some actions that is flaky it throws timeout error

## you want to retry that action max 3 times and if it fails, ignore that exception, perform some other action(not mandatory)

## and again retry

* Here the user attempts to perform
* action1 action2 and action3
* 3 times repetitively
* if one of the exceptions NovusActionException, TimeoutError occur, ignore them
* and perform someOtherAction1, someOtherAction2
* meanwhile wait for 10 seconds before trying action1 action2 and action3 again
* for more info check {@link Retry}

```typescript
await actor.attemptsTo(
  Perform.actions(action1, action2, action3)
    .thrice()
    .ifExceptionOccurs(NovusActionException, Error) // if any other exceptions occur the loop will break
    .then(someOtherAction1, someOtherAction2)
    .meanwhile(async () => await actor.isWaitingForSeconds(10))
    .log("retryAction", "retry flaky actions")
);
```

## Using Retry utility directly

```typescript
await Retry.action(async () => {
    await actor.attemptsTo(action1, action2);
  })
  .times(3)
  .ignoring(NovusActionException)
  .meanwhilePerform(async () => await actor.isWaitingForSeconds(2))
  .otherwisePerform(async () => {
    console.log("All retries failed, performing fallback");
  })
  .run();
```
