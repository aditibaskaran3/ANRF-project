import re

def preprocess_student_ans(student_ans):
  text=student_ans
  text = text.lower()

  # Replace hyphens/underscores/slashes with space
  text = re.sub(r'[-_/]', ' ', text)
  # Remove punctuation
  text = re.sub(r'[^\w\s]', ' ', text)
  # Remove extra spaces
  text = re.sub(r'\s+', ' ', text)

  return text.strip()
  # normalised_ans=student_ans

  # student_ans=student_ans.lower()
  # student_ans=' '.join(student_ans.split())  # Remove extra white spaces
  # student_ans=student_ans.translate(str.maketrans('', '', string.punctuation))
  # s=[]
  # for word in student_ans.split():
  #   s.append(word)
  # final_set=set(s)
  # final_set=list(final_set)
  # return final_set