define(["postmonger"], function(Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var lastStepEnabled = false;
  var steps = [
    { label: "Step 1", key: "step1" },
    { label: "Step 2", key: "step2" },
    { label: "Step 3", key: "step3" },
    { label: "Step 4", key: "step4", active: false }
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  function onRender() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");

    $("#offerPreference").change(function() {
      var offerPreference = getOfferPreference();
      connection.trigger("updateButton", {
        button: "next",
        enabled: Boolean(offerPreference)
      });

      $("#message").html(offerPreference);
    });

    $("#toggleLastStep").click(function() {
      lastStepEnabled = !lastStepEnabled;
      steps[3].active = !steps[3].active;
      connection.trigger("updateSteps", steps);
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var offerPreference;
    var hasInArguments =
      Boolean(
        payload["arguments"] &&
          payload["arguments"].execute &&
          payload["arguments"].execute.inArguments &&
          payload["arguments"].execute.inArguments.length > 0
      );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    $.each(inArguments, function(index, inArgument) {
      $.each(inArgument, function(key, val) {
        if (key === "offerPreference") {
          offerPreference = val;
        }
      });
    });

    if (!offerPreference) {
      showStep(null, 1);
      connection.trigger("updateButton", { button: "next", enabled: false });
    } else {
      $("#offerPreference")
        .find("option[value=" + offerPreference + "]")
        .attr("selected", "selected");
      $("#message").html(offerPreference);
      showStep(null, 3);
    }
  }

  function onGetTokens(tokens) {
    console.log(tokens);
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
  }

  function onClickedNext() {
    if (
      (currentStep.key === "step3" && steps[3].active === false) ||
      currentStep.key === "step4"
    ) {
      save();
    } else {
      connection.trigger("nextStep");
    }
  }

  function onClickedBack() {
    connection.trigger("prevStep");
  }

  function onGotoStep(step) {
    showStep(step);
    connection.trigger("ready");
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
          enabled: Boolean(getOfferPreference())
        });
        connection.trigger("updateButton", { button: "back", visible: false });
        break;
      case "step2":
        $("#step2").show();
        connection.trigger("updateButton", {
          button: "back",
          visible: true
        });
        connection.trigger("updateButton", {
          button: "next",
          text: "next",
          visible: true
        });
        break;
      case "step3":
        $("#step3").show();
        connection.trigger("updateButton", {
          button: "back",
          visible: true
        });
        if (lastStepEnabled) {
          connection.trigger("updateButton", {
            button: "next",
            text: "next",
            visible: true
          });
        } else {
          connection.trigger("updateButton", {
            button: "next",
            text: "done",
            visible: true
          });
        }
        break;
      case "step4":
        $("#step4").show();
        break;
    }
  }

  function save() {
    var offerPreference = getOfferPreference();

    payload["arguments"].execute.inArguments = [
      { offerPreference: offerPreference }
    ];

    payload["metaData"].isConfigured = true;

    connection.trigger("updateActivity", payload);
  }

  function getOfferPreference() {
    return $("#offerPreference").find("option:selected").attr("value").trim();
  }
});
