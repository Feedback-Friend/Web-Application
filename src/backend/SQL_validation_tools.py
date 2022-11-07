"""
Given a SQL connection represented by the engine, verify that there are no conflicts in the
data being stored. This is especially for the case where surveys point to the same contact list but also to different users. This is not allowed in the schema, since all surveys belonging to the same contact list should also belong to the same user.
"""
def validateSQL(engine):
    # verify that all surveys belonging to the same contact list also belong to the same user
    cursor = engine.connect()

    # make a dictionary mapping contact list ids to user ids
    contact_list_to_user = {}
    result = cursor.execute("SELECT contact_list_id, user_id FROM contact_lists;")
    for row in result:
        CLID = row[0]
        UID = row[1]
        contact_list_to_user[CLID] = UID

    # for every survey, verify that its user id is the same as the user id of the contact list it belongs to
    surveys = cursor.execute("SELECT * FROM surveys;")
    for surveyRow in surveys:
        survey_id = surveyRow[0]
        user_id = surveyRow[1]
        contact_list_id = surveyRow[2]
        if user_id != contact_list_to_user[contact_list_id]:
            raise Exception(f"Survey {survey_id} does not belong to the same user as its contact list {contact_list_id}")

    print("SQL validation successful")