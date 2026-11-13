-- Make YOUR account the administrator.
-- 1. On the website, create your account (Sign up) and confirm the email.
-- 2. Supabase -> SQL Editor -> paste this, replace the email, Run.
-- Do this for one trusted email only. The role cannot be changed from the website.

update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'REPLACE-WITH-YOUR-EMAIL@example.com');

-- Check it worked (should show one row with role = admin):
select u.email, p.role
from public.profiles p join auth.users u on u.id = p.id
where p.role = 'admin';
