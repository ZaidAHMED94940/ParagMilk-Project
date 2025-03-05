def find_missing_number(nums):
    n=len(nums)+1
    total_sum=n*(n+1)//2
    actual_sum=sum(nums)
    new=total_sum-actual_sum
    print(new)

find_missing_number([1,2,3,4,5,7])
