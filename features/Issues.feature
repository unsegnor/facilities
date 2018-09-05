Feature: Managing Issues
  As a Unit4 employee
  I want to register the issues I detect
  So that the people in facilities are aware of them

  @test
  Scenario: Projector broken in a room
    Given Employee has registered an issue with an image and the description "projector is broken"
    When Employee ask the system for the existing issues
    Then the returned issues must include an issue with the description "projector is broken" and the state "Accepted"

  @test
  Scenario: Issue in progress
    Given Employee has registered an issue with an image and the description "projector is broken"
    When Responsible indicates that is working on it
    And Employee ask the system for the existing issues
    Then the returned issues must include an issue with the description "projector is broken" and the state "In progress"

  @test
  Scenario: Fixed issue
    Given Employee has registered an issue with an image and the description "projector is broken"
    When the Responsible indicates that it is fixed
    And Employee ask the system for the existing issues
    Then the returned issues must not include an issue with the description "projector is broken"

  @pending
  Scenario: Repeated issue
    when trying to register the same issue twice
    the system must show the similar issues that are not fixed
    so that the user can select it
