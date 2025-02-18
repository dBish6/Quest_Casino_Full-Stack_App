/**
 * Returns the aggregation pipeline for fetching user profile data,
 * including activity data and statistics if it's the public profile.
 */
const userProfileAggregation = (publicProfile: boolean, statisticsData?: string) => [
  {
    $lookup: {
      from: "user_activity",
      localField: "activity",
      foreignField: "_id",
      as: "activityData"
    }
  },
  { $unwind: "$activityData" },
  {
    $set: {
      "activityData.game_history": {
        $sortArray: {
          input: "$activityData.game_history",
          sortBy: { timestamp: -1 }
        }
      }
    }
  },

  ...(publicProfile
    ? [
        ...(statisticsData
          ? [{ $set: { statisticsData: statisticsData } }]
          : [
              {
                $lookup: {
                  from: "user_statistics",
                  localField: "statistics",
                  foreignField: "_id",
                  as: "statisticsData"
                },
              },
              { $unwind: "$statisticsData" }
            ]),

        {
          $set: {
            progressQuestArray: {
              $objectToArray: "$statisticsData.progress.quest"
            }
          }
        },
        {
          $lookup: {
            from: "game_quest",
            let: { quests: "$progressQuestArray" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", { $map: { input: "$$quests", as: "quest", in: "$$quest.v.quest" } }]
                  }
                }
              },
              { $project: { _id: 1, cap: 1 } }
            ],
            as: "questDetails"
          }
        },
        {
          $set: {
            progress: {
              quest: {
                $arrayToObject: {
                  $map: {
                    input: "$progressQuestArray",
                    as: "questEntry",
                    in: {
                      k: "$$questEntry.k",
                      v: {
                        $mergeObjects: [
                          "$$questEntry.v",
                          {
                            quest: {
                              $let: {
                                vars: {
                                  matchedQuest: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: "$questDetails",
                                          as: "quest",
                                          cond: { $eq: ["$$quest._id", "$$questEntry.v.quest"] }
                                        }
                                      },
                                      0
                                    ]
                                  }
                                },
                                in: {
                                  cap: "$$matchedQuest.cap"
                                }
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            "statisticsData._id": 0,
            "statisticsData.created_at": 0,
            "statisticsData.updated_at": 0
          }
        },
        {
          $set: {
            statisticsData: {
              progress: "$progress"
            }
          }
        }
      ]
    : [])
];

export default userProfileAggregation;
