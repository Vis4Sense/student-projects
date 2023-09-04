select
    *
from
    (
        select
            id,
            url,
            time_created,
            item_id
        from
            (
                select
                    *
                from
                    amazon_user_history_record
                order by
                    time_created desc
            )
        group by
            item_id
    )
where
    1 = 1
order by
    time_created desc
limit
    5