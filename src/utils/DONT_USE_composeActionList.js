/**
 * THIS FILE CURRENTLY SERVES NO PURPOSE
 * 
 * THE IDEA WAS, THAT SOME SORT OF HELPER UTILITY WITH WHICH YOU CAN PIECE TOGETHER THE REQUEST OBJECT MIGHT BE WELCOME.
 * MY MAIN ISSUE WITH IT WAS THAT I DONT CURRENTLY SEE THE PRACTICAL USE-CASES AND THEIR REQUIREMENTS.
 * 
 * !NON OF THIS CODE SHOULD BE USED, NOR DOES ANY OF HIS WORK IN A RELIABLE MANNER! 
 */

const { createRequestXML } = require("./xmlParsing");

class ActionList {
  constructor(
    { userData, softwareData, axios},
    { actionType, translateActionSpecificData }
  ) {
    // Gets these from the initiated client.
    this.userData = userData;
    this.softwareData = softwareData;
    this.axios = axios;

    // ActionList specific stuff.
    this.actionType = actionType;
    this.translateActionSpecificData = translateActionSpecificData;
    this.actions = [];
  }
  /**
   * Adds a new action to the stored actionList.
   * If the action fails (the input parameters are not correct or the actionList is already full) it returns -1, otherwise returns the index of the added element.
   */
  add(actionName, actionData, overrides) {
    // Checking whether the list is full
    if (this.actions.length === 100) return -1
    // Handling incorrect overrides
    if (
      overrides &&
      overrides.actionType &&
      !(overrides.actionType === "manageAnnulment" || overrides.actionType === "manageInvoice")
    )
      return -1;
    if (
      overrides &&
      overrides.translateActionSpecificData &&
      typeof overrides.translateActionSpecificData != "boolean"
    )
      return -1;
    // Checking for the applicable settings
    const applicableActionType = (overrides && overrides.actionType) || this.actionType;
    const applicableTransalteActionSpecificData =
      (overrides && overrides.translateActionSpecificData) || this.translateActionSpecificData;
    // Checking for incorrect actionName
    if (applicableActionType === "manageAnnulment" && actionName != "ANNUL") return -1;
    if (
      applicableActionType === "manageInvoice" &&
      !["CREATE", "MODIFY", "STORNO"].includes(actionName)
    )
      return -1;
    // Assembling the action data
    if (applicableTransalteActionSpecificData)
      actionData = Buffer.from(createRequestXML(actionData), "utf-8").toString("base64");
    const action = applicableActionType === "manageAnnulment"
      ? ({
        index: this.actions.length,
        annulmentOperation: actionName,
        invoiceAnnulment: actionData
      })
      : ({
        index: this.actions.length,
        invoiceOperation: actionName,
        invoiceData: actionData
      })
    // Adding it to the actions
    this.actions.push(action);
    return this.actions.length - 1;
  }
  remove(index) {
    if (index < 0 || index >= this.actions.length) return null
  }
}

const actionL = new ActionList({}, {});

module.exports = ActionList;
