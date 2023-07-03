var connection = new Postmonger.Session();
var payload = {};
var steps = [{ label: "Step 1", key: "step1" }, { label: "Step 2", key: "step2" }, { label: "Step 3", key: "step3" }];
var currentStep = steps[0].key;

$(window).ready(onRender);

function onRender() {
  connection.trigger("ready");
  connection.trigger("updateButton", { button: "next", enabled: false });
  showStep();
}

connection.on("initActivity", function (initialize) {
  payload = initialize;
  var offerPreference;
  if (payload.arguments) {
    offerPreference = payload.arguments.execute.inArguments[0].offerPreference;
  }
  $("#offerPreference").val(offerPreference);
  showStep();
});

connection.on("requestedTokens", function (data) {
  console.log(data);
});

connection.on("requestedEndpoints", function (data) {
  console.log(data);
});

connection.on("clickedNext", function () {
  save();
  if (currentStep.key === "step3") {
    connection.trigger("complete");
  } else {
    currentStep = steps[steps.indexOf(currentStep) + 1];
    showStep();
  }
});

connection.on("clickedBack", function () {
  currentStep = steps[steps.indexOf(currentStep) - 1];
  showStep();
});

function save() {
  var offerPreference = $("#offerPreference").val();
  payload.arguments.execute.inArguments = [{ offerPreference: offerPreference }];
  payload.meta = { settings: { offerPreference: offerPreference } };
  connection.trigger("updateActivity", payload);
}

function getOfferPreference() {
  return $("#offerPreference").val();
}

function showStep(step, stepIndex) {
  if (stepIndex && !step) {
    step = steps[stepIndex - 1];
  }

  currentStep = step;

  $(".step").hide();

  switch (currentStep.key) {
    case "step1":
      $("#step1").show();
      connection.trigger("updateButton", {
        button: "next",
        enabled: Boolean(getOfferPreference()),
      });
      connection.trigger("updateButton", {
        button: "back",
        visible: false,
      });
      break;
    case "step2":
      $("#step2").show();
      connection.trigger("updateButton", {
        button: "back",
        visible: true,
      });
      connection.trigger("updateButton", {
        button: "next",
        text: "next",
        visible: true,
      });
      break;
    case "step3":
      $("#step3").show();
      connection.trigger("updateButton", {
        button: "back",
        visible: true,
      });
      connection.trigger("updateButton", {
        button: "next",
        text: "done",
        visible: true,
      });
      break;
  }
}
