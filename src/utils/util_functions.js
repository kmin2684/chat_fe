export function QueryStringGenerator(section, members, groupName, friends) {
  let query = new URLSearchParams();
  if (section) {
    query.append("section", section);
  }

  members.forEach((member) => {
    if (friends.includes(member)) query.append("members", member);
  });

  if (groupName?.trim()) query.append("group_name", groupName);
  return query.toString();
}
