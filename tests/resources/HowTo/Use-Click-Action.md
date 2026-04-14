## Say you want to click on a locator and later wait on another locator to be enabled and visible within 12 seconds

* Click on `locator`
* after clicking on `locator`
* wait for another `locator`
* to be `visible`
* within `12` seconds

```typescript
await actor.attemptsTo(
  Click.on(locator).laterWaiting(
    Waiting.on(anotherLocator).withState("enabled").toBe("visible").within(12)
  )
);
```

## Say you want to Wait for 2 seconds and have 3 delete buttons, after you click on delete every time you need to accept by clicking on Yes btn

* Wait for 2 seconds
* Click on `locator`
* if the `locator` is displayed
* multiple times as along as the `locator` is invisible on GUI
* and click on yes btn every time

```typescript
await actor.attemptsTo(
  Click.on(locator).ifDisplayed().multipleTimes().and().accept(yesBtn).byWaitingFor(2)
);
```

## Say you want to click on a locator inside a frame

* Switch to the frame with name `frameName`
* and wait for visibility of `anotherLocator`
* and then
* click on `locator`
* at index `3`

```typescript
await actor.attemptsTo(
  Click.on(locator)
    .nth(3)
    .bySwitchingToFrame(frameName)
    .afterWaiting(Waiting.on(anotherLocator))
);
```

## Say you have click on a locator if it is displayed or else you want to perform other action1 and other action 2

* Click on `locator`
* if `locator` is displayed
* or else
* perform actions `doAction1()` and `doAction2()`

```typescript
await actor.attemptsTo(
  Click.on(locator).ifDisplayed().orElse(doAction1(), doAction2())
);
```
