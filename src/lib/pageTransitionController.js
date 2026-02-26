let controller = null;

export function registerPageTransitionController(nextController) {
  controller = nextController;

  return () => {
    if (controller === nextController) {
      controller = null;
    }
  };
}

export function getPageTransitionController() {
  return controller;
}

export async function coverPageTransition(options) {
  if (!controller) {
    return;
  }

  await controller.cover(options);
}

export async function revealPageTransition(options) {
  if (!controller) {
    return;
  }

  await controller.reveal(options);
}

export function isPageTransitionCovered() {
  if (!controller) {
    return false;
  }

  return controller.isCovered();
}
