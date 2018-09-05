Feature: Notifications
  As a user
  I want to be notified about changes in the issues

  @pending
  Scenario: Notify facilities responsible
    As a responsible
    I want to be notified about the creation of issues
    So that I can fix them quickly

  @pending
  Scenario: Notify changes on issues
    As an employee
    I want to be notified about the changes in the issues
    So that I can schedule my meetings in fully functional rooms

    Given Employee is registered in the system
    And Employee has registered an issue
    When Responsible indicates that is working on it
    Then Employee is notified as the issue state has changed to "In progress"
