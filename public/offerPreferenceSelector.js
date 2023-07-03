define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var steps = [
    { label: "Select Offer Preference", key: "step1" },
    { label: "Summary", key: "step2" }
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

    $("#offerPreference").change(function () {
      var message = getOfferPreference();
      connection.trigger("updateButton", {
        button: "next",
        enabled: Boolean(message),
      });
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var offerPreference;
    var hasInArguments = Boolean(
        payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
        ? payload["arguments"].execute.inArguments
        : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
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
      showStep(null, 2);
    }
  }

  function onGetTokens(tokens) {
    console.log(tokens);
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
  }

  function onClickedNext() {
    if (currentStep.key === "step2") {
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
          text: "done",
          visible: true,
        });
        break;
    }
  }

  function save() {
    var offerPreference = getOfferPreference();
    payload["arguments"].execute.inArguments = [{ offerPreference: offerPreference }];
    payload["metaData"].isConfigured = true;
    connection.trigger("updateActivity", payload);
  }

  function getOfferPreference() {
    return $("#offerPreference").find("option:selected").val().trim();
  }
});
